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

namespace oat\taoRestApiDocs\test\docs;


use oat\tao\test\TaoPhpUnitTestRunner;
use oat\taoRestApiDocs\model\proxy\format\Swagger2_0;
use oat\taoRestApiDocs\model\service\docs\DocsService;

/**
 * Class RestApiDocsServiceTest
 */
class DocsServiceTest extends TaoPhpUnitTestRunner
{

    /**
     * @var DocsService
     */
    private $service = null;

    private $samplesPath;

    public function setUp()
    {
        parent::setUp();
        
        $this->samplesPath = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'samples' . DIRECTORY_SEPARATOR;
        
        $this->service = new DocsService([
            DocsService::OPTION_DOCS => [
                $this->samplesPath . 'lti.json',
                $this->samplesPath . 'QtiItem.json',
            ],
            DocsService::OPTION_PROXY => Swagger2_0::class,
        ]);
    }
    
    /**
     * @expectedException \oat\taoRestApiDocs\model\exception\RestApiDocsException
     * @expectedExceptionMessage File with documentation not found
     */
    public function testAddDocException()
    {
        $this->service->addDoc('');
    }

    /**
     * @expectedException \oat\taoRestApiDocs\model\exception\RestApiDocsException
     * @expectedExceptionMessage Incorrect file structure
     */
    public function testAddInvalidDoc()
    {
        $this->service->addDoc($this->samplesPath . 'failure.json');
    }
    
    
    public function testGenerateDoc()
    {
        $docs = $this->service->generateDocs()->getDocs();
        $this->assertEquals('2.0', $docs->swagger);
    }

    /**
     * @expectedException \oat\taoRestApiDocs\model\exception\RestApiDocsException
     * @expectedExceptionMessage Proxy does not exists
     */
    public function testDocsProxyNotExists()
    {
        new DocsService(['proxy' => 'Failure']);
    }

    /**
     * @expectedException \oat\taoRestApiDocs\model\exception\RestApiDocsException
     * @expectedExceptionMessage Incorrect proxy for Restful documentations
     */
    public function testInvalidDocsProxy()
    {
        new DocsService(['proxy' => \stdClass::class]);
    }
    
    public function testValidDocsProxy()
    {
        $service = new DocsService(['proxy' => Swagger2_0::class]);
        $this->assertEquals(DocsService::class, get_class($service));
    }
}
