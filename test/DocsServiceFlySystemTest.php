<?php
/**
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2016  (original work) Open Assessment Technologies SA;
 * 
 * @author Alexander Zagovorichev <zagovorichev@1pt.com>
 */

namespace oat\taoRestApiDocs\test;


use oat\oatbox\filesystem\FileSystemService;
use oat\oatbox\service\ServiceManager;
use oat\tao\test\TaoPhpUnitTestRunner;
use oat\taoRestApiDocs\model\proxy\format\Swagger2_0;
use oat\taoRestApiDocs\model\service\docs\DocsService;

class DocsServiceFlySystemTest extends TaoPhpUnitTestRunner
{
    /**
     * @var DocsService
     */
    private $service;

    private $samplesPath;

    /**
     * @var \League\Flysystem\Filesystem
     */
    private $storage;

    public function setUp()
    {
        parent::setUp();

        $this->samplesPath = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'samples' . DIRECTORY_SEPARATOR;

        $this->service = new DocsService([
            DocsService::OPTION_FILE_NAME => 'PhpUnitTest.json',
            DocsService::OPTION_DOCS => [
                $this->samplesPath . 'lti.json',
                $this->samplesPath . 'QtiItem.json',
            ],
            DocsService::OPTION_PROXY => Swagger2_0::class,
        ]);

        $this->storage = ServiceManager::getServiceManager()
            ->get(FileSystemService::SERVICE_ID)
            ->getFileSystem(DocsService::STORAGE_NAME);
    }

    public function tearDown()
    {
        parent::tearDown();
        
        // delete file
        if ($this->storage->has($this->service->getOption(DocsService::OPTION_FILE_NAME))) {
            $this->storage->delete($this->service->getOption(DocsService::OPTION_FILE_NAME));
        }
    }

    /**
     * Create file in storage and write there json with data
     */
    public function testGenerateDoc()
    {
        $this->service->generateDocs()->saveDocs();
        $this->assertTrue($this->storage->has($this->service->getOption(DocsService::OPTION_FILE_NAME)));
    }

    /**
     * read data from storage
     */
    public function testReadDoc()
    {
        $this->service->generateDocs()->saveDocs();
        $service = new DocsService([
            DocsService::OPTION_FILE_NAME => 'PhpUnitTest.json',
            DocsService::OPTION_DOCS => [
                $this->samplesPath . 'lti.json',
                $this->samplesPath . 'QtiItem.json',
            ],
            DocsService::OPTION_PROXY => Swagger2_0::class,
        ]);

        $docs = $service->getDocs();
        
        $this->assertEquals('2.0', $docs->swagger);
    }
    
    /**
     * Should delete file with documentation
     */
    public function testDropDoc()
    {
        $this->testGenerateDoc();
        $this->service->dropDocs();
        $this->assertFalse($this->storage->has($this->service->getOption(DocsService::OPTION_FILE_NAME)));
    }
}
