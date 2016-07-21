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
use oat\taoRestApiDocs\model\service\docs\DocsService;

/**
 * Class RestApiDocsServiceTest
 * @package oat\taoRestAPI\test\docs
 */
class DocsServiceTest extends TaoPhpUnitTestRunner
{

    /**
     * @var DocsService
     */
    private $service = null;
    
    public function setUp()
    {
        parent::setUp();
        
        $samplesPath = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'samples' . DIRECTORY_SEPARATOR;
        
        $this->service = new DocsService();
    }
    
    public function tearDown()
    {
        $this->service->dropDocs();
        parent::tearDown();
    }

    /**
     * @expectedException \oat\taoRestApiDocs\model\exception\RestApiDocsException
     */
    public function testInvalidConfigException()
    {
        new DocsService([]);
    }

    /**
     * @expectedException \oat\taoRestApiDocs\model\exception\RestApiDocsException
     */
    public function testWithoutSwaggerPhpDoc()
    {
        new DocsService(['proxy' => 'Swagger', 'routes' => ['Example' => '\oat\taoRestAPI\test\docs\DocsServiceTest']]);
    }

    /**
     * @expectedException \oat\taoRestApiDocs\model\exception\RestApiDocsException
     */
    public function testIncorrectSection()
    {
        $this->service->generateDocs('FailureService');
    }


    public function testGenerateSectionDocs()
    {
        $data = $this->service->generateDocs('Lti');

        $this->assertTrue(isset($data));
        $this->assertEquals('2.0', $data->swagger);
        $this->assertEquals("Lti REST API", $data->info->title);
    }

    public function testGenerateDocs()
    {
        $data = $this->service->generateDocs();

        $this->assertTrue(isset($data));
        $this->assertEquals('2.0', $data->swagger);
    }
    
    public function testJsonDocs()
    {
        $data = $this->service->jsonDocs();
    }
}
